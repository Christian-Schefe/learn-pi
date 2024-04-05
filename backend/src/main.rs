mod service;

use crate::service::ServiceResult;
use std::net::SocketAddr;

use axum::{
    extract::{ConnectInfo, Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use num_traits::cast::ToPrimitive;
use serde::{Deserialize, Serialize};
use shuttle_runtime::CustomError;
use sqlx::{prelude::FromRow, PgPool};

async fn retrieve(
    Path(id): Path<i32>,
    State(state): State<AppState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Entry>("SELECT * FROM scores WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(entry) => Ok((StatusCode::OK, Json(entry))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

async fn add(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<AppState>,
    Json(data): Json<NewEntry>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Entry>(
        "INSERT INTO scores(score, ip_address) VALUES ($1, $2) RETURNING id, score, created_at, ip_address",
    )
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
    match sqlx::query_scalar::<_, sqlx::types::BigDecimal>("SELECT AVG(score) FROM scores")
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
    sqlx::migrate!().run(&db).await.map_err(CustomError::new)?;

    let state = AppState { db };

    // let origins: [HeaderValue; 1] = ["http://christian-schefe.github.io/learn-pi"
    //     .parse()
    //     .unwrap()];
    let cors = tower_http::cors::CorsLayer::permissive();

    let router = Router::new()
        .route("/scores", post(add))
        .route("/scores/:id", get(retrieve))
        .route("/stats/avg", get(stats_avg))
        .with_state(state)
        .layer(cors);

    Ok(router.into())
}
