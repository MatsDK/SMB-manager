#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tarpc::{client, context, tokio_serde::formats::Json};

mod service {
    #[tarpc::service]
    pub trait SmbApi {
        async fn get_conf() -> String;

        async fn set_conf(conf: String) -> String;

        async fn restart_service();

        async fn get_service_status() -> bool;
    }
}

#[tauri::command]
async fn get_conf(url: String) -> String {
    let client = get_client(url).await;
    let response = client.get_conf(context::current()).await.unwrap();

    response
}

#[tauri::command]
async fn set_conf(url: String, conf: String) -> String {
    let client = get_client(url).await;
    let response = client.set_conf(context::current(), conf).await.unwrap();

    response
}

#[tauri::command]
async fn restart_service(url: String) {
    let client = get_client(url).await;
    let _response = client.restart_service(context::current()).await.unwrap();
}

#[tauri::command]
async fn get_service_status(url: String) -> bool {
    println!("get service status {url}");
    let client = get_client(url).await;
    let response = client.get_service_status(context::current()).await.unwrap();

    response
}

#[tauri::command]
async fn connect_share(drive: String, endpoint: String) {
    let out = Command::new("net")
        .args(["use", &format!("{drive}:"), &endpoint])
        .output()
        .expect("failed to mount drive");

    println!("{:?}", out);

    let out = Command::new("explorer")
        .args([&format!("{drive}:")])
        .output()
        .expect("failed to open explorer");

    println!("{:?}", out);
}

async fn get_client(url: String) -> service::SmbApiClient {
    let transport = tarpc::serde_transport::tcp::connect(url.clone(), Json::default);

    service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_conf,
            set_conf,
            restart_service,
            get_service_status,
            connect_share
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
