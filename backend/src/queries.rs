use serde::Serialize;
use sqlx::prelude::FromRow;

const SCORES_TABLE: &str = "scores";

pub fn add_score_query() -> String {
    format!("INSERT INTO {SCORES_TABLE}(score, ip_address) VALUES ($1, $2) RETURNING id, score, created_at, ip_address")
}

pub fn stats_avg_query() -> String {
    format!("SELECT AVG(score) FROM {SCORES_TABLE}")
}

pub fn count_all() -> String {
    format!("SELECT COUNT(*) FROM {SCORES_TABLE}")
}

#[derive(FromRow)]
pub struct ScoreRanges {
    pub score_range: String,
    pub count_in_range: i64,
}

#[derive(Serialize)]
pub struct SerializableScoreRange {
    pub score_range: String,
    pub count_in_range: i64,
    pub ratio: f64,
}

impl ScoreRanges {
    pub fn as_serializable(self, total_count: i64) -> SerializableScoreRange {
        SerializableScoreRange {
            score_range: self.score_range,
            count_in_range: self.count_in_range,
            ratio: self.count_in_range as f64 / total_count as f64,
        }
    }
}

pub fn score_ranges_query() -> String {
    let case_count = 10;
    let case_size = 10;
    let case_query = |i: usize| -> String {
        let start = case_size * i + 1;
        let end = case_size * i + case_size;
        if i < case_count {
            format!(
                "WHEN score >= {0} AND score <= {1} THEN '{0}-{1}'",
                start, end
            )
        } else {
            format!("ELSE '{}+'", i * case_size)
        }
    };

    let cases: String = (0..=case_count)
        .map(case_query)
        .collect::<Vec<String>>()
        .join(" ");

    format!(
        "SELECT CASE {cases} END AS score_range, COUNT(*) as count_in_range FROM {SCORES_TABLE} GROUP BY score_range;"
    )
}
