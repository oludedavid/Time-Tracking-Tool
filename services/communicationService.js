import CommentModel from "../models/CommentModel.js";
import ReplyModel from "../models/ReplyModel.js";
import ReplyCommentModel from "../models/ReplyCommentModel.js";
import WorkingHoursModel from "../models/WorkingHoursModel.js";

class CommunicationService {
  /**
   * Creates a comment on a working hours entry.
   * @param {Object} comment - The comment details.
   * @param {String} comment.comment - The content of the comment.
   * @param {String} comment.userId - The ID of the user creating the comment.
   * @param {String} comment.workinghoursEntryId - The ID of the associated working hours entry.
   * @returns {Object} - The created comment.
   */
  static async createComment(comment) {
    const { comment: commentText, userId, workinghoursEntryId } = comment;

    try {
      // Validate the associated working hours entry
      const workingHoursEntry = await WorkingHoursModel.findById(
        workinghoursEntryId
      );
      if (!workingHoursEntry) {
        throw new Error("Working hours entry not found.");
      }

      // Create a new comment
      const newComment = await CommentModel.create({
        comment: commentText,
        userId,
        workinghoursEntryId,
      });

      // Add the comment to the working hours entry
      workingHoursEntry.comments.push(newComment._id);
      await workingHoursEntry.save();

      return newComment;
    } catch (error) {
      throw new Error(`Error creating comment: ${error.message}`);
    }
  }

  /**
   * Creates a reply to a comment.
   * @param {Object} reply - The reply details.
   * @param {String} reply.reply - The content of the reply.
   * @param {String} reply.userId - The ID of the user creating the reply.
   * @param {String} reply.commentId - The ID of the comment being replied to.
   * @returns {Object} - The created reply.
   */
  static async createReply(reply) {
    const { reply: replyText, userId, commentId } = reply;

    try {
      // Validate the associated comment
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        throw new Error("Comment not found.");
      }

      // Create a new reply
      const newReply = await ReplyModel.create({
        reply: replyText,
        userId,
        commentId,
      });

      // Add the reply to the comment
      comment.replies.push(newReply._id);
      await comment.save();

      return newReply;
    } catch (error) {
      throw new Error(`Error creating reply: ${error.message}`);
    }
  }

  /**
   * Creates a reply to a reply (i.e., a comment on a reply).
   * @param {Object} replyComment - The reply comment details.
   * @param {String} replyComment.comment - The content of the comment.
   * @param {String} replyComment.userId - The ID of the user creating the reply comment.
   * @param {String} replyComment.replyId - The ID of the reply being commented on.
   * @returns {Object} - The created reply comment.
   */
  static async replyToComment(replyComment) {
    const { comment: commentText, userId, replyId } = replyComment;

    try {
      // Validate the associated reply
      const reply = await ReplyModel.findById(replyId);
      if (!reply) {
        throw new Error("Reply not found.");
      }

      // Create a new reply comment
      const newReplyComment = await ReplyCommentModel.create({
        comment: commentText,
        userId,
        replyId,
      });

      // Add the reply comment to the reply
      reply.replies.push(newReplyComment._id);
      await reply.save();

      return newReplyComment;
    } catch (error) {
      throw new Error(`Error creating reply comment: ${error.message}`);
    }
  }
}

export default CommunicationService;
