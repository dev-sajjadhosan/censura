import jwt from 'jsonwebtoken'


export const verifyToken = (token:string,secret:string) => {
    try{
        const decode = jwt.verify(token,secret) as jwt.JwtPayload
        return {success: true, data:decode}
    }catch(error:any){
        return {
            success: false,
            message: error.message,
            error,
        }
    }
}

export const decodeToken = (token:string) => {
    try{
        const decode = jwt.decode(token) as jwt.JwtPayload
        return {success: true, data:decode}
    }catch(error:any){
        return {
            success: false,
            message: error.message,
            error,
        }
    }
}

