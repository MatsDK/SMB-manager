#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
async fn get_conf_command(url: String) -> String {
    let url = format!("{}/conf", url);
    let resp = reqwest::get(url).await.unwrap().text().await.unwrap();

    resp
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_conf_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
