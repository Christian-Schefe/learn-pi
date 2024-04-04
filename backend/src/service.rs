use axum::Router;
use shuttle_runtime::{CustomError, Error};
use std::net::SocketAddr;

pub struct CustomService(pub Router);

#[shuttle_runtime::async_trait]
impl shuttle_runtime::Service for CustomService {
    async fn bind(mut self, addr: SocketAddr) -> Result<(), Error> {
        axum::serve(
            shuttle_runtime::tokio::net::TcpListener::bind(addr)
                .await
                .map_err(CustomError::new)?,
            self.0.into_make_service_with_connect_info::<SocketAddr>(),
        )
        .await
        .map_err(CustomError::new)?;
        Ok(())
    }
}

impl From<Router> for CustomService {
    fn from(router: Router) -> Self {
        Self(router)
    }
}

pub type ServiceResult = Result<CustomService, Error>;
