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
pub struct ScoreRange {
    pub score_range: String,
    pub count_in_range: i64,
}

#[derive(Serialize)]
pub struct SerializableScoreRange {
    pub count_in_range: i64,
    pub range_index: usize,
}

#[derive(Serialize)]
pub struct ScoreRangeData {
    pub ranges: Vec<SerializableScoreRange>,
    pub range_size: usize,
    pub range_count: usize,
    pub total_count: usize,
}

impl ScoreRange {
    pub fn as_serializable(self) -> SerializableScoreRange {
        SerializableScoreRange {
            count_in_range: self.count_in_range,
            range_index: self.score_range.parse().unwrap_or_default(),
        }
    }
}

pub fn score_ranges_query(range_step: usize, range_count: usize) -> String {
    let case_query = |i: usize| -> String {
        let start = range_count * i + 1;
        let end = range_count * i + range_count;
        if i < range_step {
            format!("WHEN score >= {} AND score <= {} THEN '{}'", start, end, i)
        } else {
            format!("ELSE '{}'", i)
        }
    };

    let cases: String = (0..=range_step)
        .map(case_query)
        .collect::<Vec<String>>()
        .join(" ");

    format!(
        "SELECT CASE {cases} END AS score_range, COUNT(*) as count_in_range FROM {SCORES_TABLE} GROUP BY score_range;"
    )
}
