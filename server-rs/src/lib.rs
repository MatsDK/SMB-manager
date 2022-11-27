#[derive(Debug)]
struct Msg {
    test: u8
}

#[tarpc::service]
pub trait SmbApi {
    async fn get_conf(msg: Msg) -> String;

    async fn set_conf(conf: String) -> String;

    async fn restart_service();

    async fn get_service_status() -> bool;
}
