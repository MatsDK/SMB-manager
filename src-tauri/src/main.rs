#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tarpc::{client, context, tokio_serde::formats::Json};

mod service {
    #[tarpc::service]
    pub trait SmbApi {
        async fn get_conf() -> String;

        async fn set_conf(conf: String) -> String;

        async fn restart_service();
    }
}

#[tauri::command]
async fn get_conf_command(url: String) -> String {
    let transport = tarpc::serde_transport::tcp::connect(url, Json::default);

    let client =
        service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn();

    let response = client.get_conf(context::current()).await.unwrap();

    response
}

#[tauri::command]
async fn set_conf_command(url: String, conf: String) -> String {
    let transport = tarpc::serde_transport::tcp::connect(url.clone(), Json::default);

    let client =
        service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn();

    let response = client.set_conf(context::current(), conf).await.unwrap();

    response
}

#[tauri::command]
async fn restart_service_command(url: String) {
    let transport = tarpc::serde_transport::tcp::connect(url.clone(), Json::default);

    let client =
        service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn();

    let _response = client.restart_service(context::current()).await.unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_conf_command,
            set_conf_command,
            restart_service_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
