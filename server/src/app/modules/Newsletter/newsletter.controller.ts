import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendRes";
import { NewsletterService } from "./newsletter.service";

const subscribeToNewsletter = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const result = await NewsletterService.subscribeToNewsletter(email);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Newsletter subscribed successfully",
        data: result,
    });
});

export const NewsletterController = {
    subscribeToNewsletter
}