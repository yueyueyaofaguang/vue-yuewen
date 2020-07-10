module.exports = {
    devServer:{
        port: 8080,
        host: "localhost",
        https:false,
        open:false,
        proxy: {
            '/api': {
                target: 'http://localhost:8443',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}