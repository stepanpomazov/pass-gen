/** @type {import('next').NextConfig} */
const nextConfig = {
    // Отключаем Turbopack для продакшн билда
    experimental: {
        turbo: undefined
    }
}

module.exports = nextConfig