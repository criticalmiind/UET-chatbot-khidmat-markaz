export const SOCKET_CONFIG = (connection1) => ({
    // 'transports': ['websocket'],
    'rejectUnauthorized': false,
    "transportOptions": {
        "polling": {
            "extraHeaders": {
                'connectionid': connection1
            }
        }
    }
})

export const CONST = {
}
export const uri = {
}

export const method = {
}
