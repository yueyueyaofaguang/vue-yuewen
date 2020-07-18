module.exports = {
    devServer:{
        port: 8080,
        host: "localhost",
        https:false,
        open:false,
        proxy: {
            '/api': {
                target: 'http://112.124.17.27:8443',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}