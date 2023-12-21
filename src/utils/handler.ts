export enum StatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  ERROR = 500,
}
export interface ResponseMessage<T> {
  message?: string
  success: boolean
  data?: T
}

class Handler {
  success = <T>({
    message,
    data,
  }: Omit<ResponseMessage<T>, "success">): ResponseMessage<T> => {
    const responseData = {
      message: message || "Success",
      success: true,
      data,
    }
    return responseData
  }
  error = <T>({
    message,
  }: Omit<ResponseMessage<T>, "success">): ResponseMessage<T> => {
    const data = {
      message: message || "Error",
      success: false,
    }
    return data
  }
}
const handler = new Handler()
export default handler
