#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::Serialize;

#[tauri::command]
async fn get_conf_command(url: String) -> String {
    let url = format!("{}/conf", url);
    let resp = reqwest::get(url).await.unwrap().text().await.unwrap();

    resp
}

#[derive(Serialize)]
struct SetConfBody {
    conf: String,
}

#[tauri::command]
async fn set_conf_command(url: String, conf: String) {
    let client = reqwest::Client::new();

    let body = SetConfBody { conf };

    let url = format!("{}/set-conf", url);
    let _res = client.post(url).json(&body).send().await.unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_conf_command, set_conf_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
