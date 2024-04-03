use axum::{
    extract::{Path, State},
    http::{Method, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use shuttle_runtime::CustomError;
use sqlx::{prelude::FromRow, PgPool};
use tower_http::cors::Any;

async fn retrieve(
    Path(id): Path<i32>,
    State(state): State<AppState>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Entry>("SELECT * FROM scores WHERE id = $1")
        .bind(id)
        .fetch_one(&state.db)
        .await
    {
        Ok(todo) => Ok((StatusCode::OK, Json(todo))),
        Err(e) => Err((StatusCode::BAD_REQUEST, e.to_string())),
    }
}

async fn add(
    State(state): State<AppState>,
    Json(data): Json<NewEntry>,
) -> Result<impl IntoResponse, impl IntoResponse> {
    match sqlx::query_as::<_, Entry>("INSERT INTO scores(score) VALUES ($1) RETURNING id, score")
        .bind(&data.score)
        .fetch_one(&state.db)
        .await
    {
        Ok(todo) => Ok((StatusCode::CREATED, Json(todo))),
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

#[derive(Serialize, FromRow)]
struct Entry {
    id: i32,
    score: i32,
}

#[shuttle_runtime::main]
async fn main(#[shuttle_shared_db::Postgres] db: PgPool) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!().run(&db).await.map_err(CustomError::new)?;

    let state = AppState { db };

    // let origins: [HeaderValue; 1] = ["http://christian-schefe.github.io/learn-pi"
    //     .parse()
    //     .unwrap()];
    let cors = tower_http::cors::CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    let router = Router::new()
        .route("/scores", post(add))
        .route("/scores/:id", get(retrieve))
        .with_state(state)
        .layer(cors);

    Ok(router.into())
}
