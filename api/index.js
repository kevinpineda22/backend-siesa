export default function handler(req, res) {
  res.status(200).json({
    status: "Online",
    message: "Backend Siesa Proxy is running correctly.",
    endpoints: {
      proxy: "/siesa-proxy"
    }
  });
}
