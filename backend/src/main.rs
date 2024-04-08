mod queries;
mod service;

use crate::service::ServiceResult;
use std::net::SocketAddr;

use axum::{
    extract::{ConnectInfo, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use num_traits::cast::ToPrimitive;
use queries::{
    add_score_query, count_all, score_ranges_query, stats_avg_query, ScoreRange, ScoreRangeData,
    SerializableScoreRange,
};
use serde::{Deserialize, Serialize};
use shuttle_runtime::CustomError;
use sqlx::{prelude::FromRow, Executor, PgPool};

async fn add(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<AppState>,
    Json(data): Json<NewEntry>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Entry>(&add_score_query())
        .bind(&data.score)
        .bind(&addr.ip().to_string())
        .fetch_one(&state.db)
        .await
    {
        Ok(entry) => Ok((StatusCode::CREATED, Json(entry))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

async fn stats_avg(State(state): State<AppState>) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_scalar::<_, sqlx::types::BigDecimal>(&stats_avg_query())
        .fetch_one(&state.db)
        .await
    {
        Ok(avg) => Ok((
            StatusCode::OK,
            Json(serde_json::json!({"average_score": avg.to_f64()})),
        )),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

async fn stats_ranges_perc(
    State(state): State<AppState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let total_count = match sqlx::query_scalar::<_, i64>(&count_all())
        .fetch_one(&state.db)
        .await
    {
        Ok(val) => Ok(val),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }?;

    let range_count = 10;
    let range_size = 10;

    match sqlx::query_as::<_, ScoreRange>(&score_ranges_query(range_size, range_count))
        .fetch_all(&state.db)
        .await
    {
        Ok(avg) => {
            let ranges: Vec<SerializableScoreRange> =
                avg.into_iter().map(|x| x.as_serializable()).collect();
            let data = ScoreRangeData {
                range_count,
                range_size,
                total_count: total_count.try_into().unwrap(),
                ranges,
            };
            Ok((StatusCode::OK, Json(data)))
        }
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

#[derive(Clone)]
struct AppState {
    db: PgPool,
}

#[derive(Deserialize)]
struct NewEntry {
    score: i32,
}

#[derive(Deserialize, Serialize, FromRow)]
struct Entry {
    id: i32,
    score: i32,
    created_at: sqlx::types::chrono::NaiveDateTime,
    ip_address: String,
}

#[shuttle_runtime::main]
async fn main(#[shuttle_shared_db::Postgres] db: PgPool) -> ServiceResult {
    db.execute(include_str!("../schema.sql"))
        .await
        .map_err(CustomError::new)?;

    let state = AppState { db };

    let cors = tower_http::cors::CorsLayer::permissive();

    let router = Router::new()
        .route("/scores", post(add))
        .route("/stats/avg", get(stats_avg))
        .route("/stats/ranges", get(stats_ranges_perc))
        .with_state(state)
        .layer(cors);

    Ok(router.into())
}
