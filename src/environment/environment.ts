interface environmentConfig {
    use:'assets'|'local'|'server',
    api:string
}

export const environment:environmentConfig = {
    use : 'local', // assets, local or server
    api: 'http://localhost:5000/api'
}