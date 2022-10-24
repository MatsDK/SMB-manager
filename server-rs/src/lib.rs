#[tarpc::service]
pub trait SmbApi {
    async fn get_conf() -> String;

    async fn set_conf(conf: String);
}