interface environmentConfig {
    use: 'assets'|'local'|'server',
    api: string
}

export const environment: environmentConfig = {
    use: 'server',
    api: 'http://localhost:5000/api'
}