const express = require("express");
const CommunicationService = require("../../services/communication");
const authMiddleware = require("../../middlewares/authMiddleware");
const { checkPermission } = require("../../middlewares/rbacMiddleware");

const router = express.Router();

/**
 * @route POST /comments
 * @desc Create a comment on a working hours entry
 * @access Protected
 */
router.post(
  "/comments",
  authMiddleware,
  checkPermission(["comments:create", "*"]),
  async (req, res) => {
    try {
      const { comment, workinghoursEntryId } = req.body;
      const userId = req.user.id;

      const newComment = await CommunicationService.createComment({
        comment,
        userId,
        workinghoursEntryId,
      });

      res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * @route POST /replies
 * @desc Create a reply to a comment
 * @access Protected
 */
router.post(
  "/replies",
  authMiddleware,
  checkPermission(["replys:create", "*"]),
  async (req, res) => {
    try {
      const { reply, commentId } = req.body;
      const userId = req.user.id;

      const newReply = await CommunicationService.createReply({
        reply,
        userId,
        commentId,
      });

      res.status(201).json({ success: true, reply: newReply });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * @route POST /reply-comments
 * @desc Create a reply to a reply (i.e., comment on a reply)
 * @access Protected
 */
router.post(
  "/reply-comments",
  authMiddleware,
  checkPermission(["replycomments:create", "*"]),
  async (req, res) => {
    try {
      const { comment, replyId } = req.body;
      const userId = req.user.id;

      const newReplyComment = await CommunicationService.replyToComment({
        comment,
        userId,
        replyId,
      });

      res.status(201).json({ success: true, replyComment: newReplyComment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
