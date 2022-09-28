#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
async fn get_conf_command(url: String) -> String {
    let resp = reqwest::get("http://192.168.0.164:3000/trpc/getConfig?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D")
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    resp
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_conf_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
