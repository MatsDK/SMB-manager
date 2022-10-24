#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::Serialize;
use tarpc::{client, context, tokio_serde::formats::Json};

mod service {
    #[tarpc::service]
    pub trait SmbApi {
        async fn get_conf() -> String;

        async fn set_conf(conf: String);
    }
}

#[tauri::command]
async fn get_conf_command(url: String) -> String {
    // let url = format!("{}/conf", url);
    // let resp = reqwest::get(url).await.unwrap().text().await.unwrap();

    let _addr = "localhost:3000";
    let transport = tarpc::serde_transport::tcp::connect(url, Json::default);

    let client =
        service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn();

    let response = client.get_conf(context::current()).await.unwrap();
    println!("response: {:?}", response);

    response
}

#[derive(Serialize)]
struct SetConfBody {
    conf: String,
}

#[tauri::command]
async fn set_conf_command(url: String, conf: String) -> String {
    // let client = reqwest::Client::new();

    // let body = SetConfBody { conf };

    // let post_url = format!("{}/set-conf", url);
    // let _res = client.post(post_url).json(&body).send().await.unwrap();

    let _addr = "localhost:3000";
    let transport = tarpc::serde_transport::tcp::connect(url.clone(), Json::default);

    let client =
        service::SmbApiClient::new(client::Config::default(), transport.await.unwrap()).spawn();

    let response = client.set_conf(context::current(), conf).await.unwrap();
    println!("response: {:?}", response);

    get_conf_command(url).await
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_conf_command, set_conf_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
