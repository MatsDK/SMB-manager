use tarpc::{
    context,
    server::{self, Channel, incoming::Incoming},
    tokio_serde::formats::Json,
};
use service::SmbApi;
use futures::stream::StreamExt;
use std::{io::Write, fs, net::SocketAddr, process::Command};
use sysinfo::{System, SystemExt};

mod constants;
use constants::SMB_CONF_PATH;

#[derive(Clone)]
struct SmbApiServer(SocketAddr);

#[tarpc::server]
impl SmbApi for SmbApiServer {
    async fn get_conf(self, _: context::Context) -> String {
        fs::read_to_string(SMB_CONF_PATH).unwrap()
    }

    async fn set_conf(self, _: context::Context, conf: String) -> String {
        println!("{conf}");

        let mut file = fs::File::create(SMB_CONF_PATH).unwrap();
        file.write_all(conf.as_bytes()).unwrap();

        fs::read_to_string(SMB_CONF_PATH).unwrap()
    }

    async fn restart_service(self, _: context::Context) {
        // service smbd restart
        let status = Command::new("service").args(["smbd", "restart"]).status().unwrap();
        println!("restart service status: {:?}", status);
        // ufw allow samba
        // let status = Command::new("ufw").args(["allow", "samba"]).status().unwrap();
        // println!("update ufw rules status: {:?}", status);
    }

    async fn get_service_status(self, _: context::Context) -> bool {
        let s = System::new_all();
        for _ in s.processes_by_exact_name("smbd") {
            return true;
        }

        false
    }

}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let server_addr = "localhost:3000";
    let mut listener = tarpc::serde_transport::tcp::listen(&server_addr, Json::default).await?;

    listener.config_mut().max_frame_length(usize::MAX);
    listener
		.filter_map(|r| futures::future::ready(r.ok()))
        .map(server::BaseChannel::with_defaults)
        // Limit channels to 1 per IP.
        .max_channels_per_key(1, |t| t.transport().peer_addr().unwrap().ip())
		.map(|channel| {
			let server = SmbApiServer(channel.transport().peer_addr().unwrap());
            channel.execute(server.serve())
        })
        .buffer_unordered(10)
        .for_each(|_| async {})
        .await;

    Ok(())
}