# Copy_Overflow

The application (REST APIs) serves as a platform for users to ask and answer questions, and, through membership and active participation, to vote questions and answers up or down similar to Reddit/Stack overflow and edit questions and answers.

---

<b>Tech Stack:</b> NodeJs, MongoDB, Postman, VsCode

### Features:

Every operation is authenticated by JWT.

- User Registration
- User Login
- All CRUD operations by user on question
- All CRUD operations by user on answer
- Upvote/Downvote the question
- Upvote/Downvote the answer
- Get all the answer of particular question

### Supported APIs

#### User

- router.post("/register", users.register);
- router.post("/login", users.login);

#### Question

- router.post("/ask_question", auth, question.ask_question);

- router.get("/:id/answers", question.answers);
- router.get("/:id", question.get_question);

- router.patch("/:id", auth, question.update_question);
- router.patch("/:id/upvote", auth, question.upvote);
- router.patch("/:id/downvote", auth, question.downvote);

- router.delete("/:id", auth, question.delete_question);

#### Answer

- router.post("/add_answer", auth, answer.add_answer);

- router.get("/:id", answer.get_answer);

- router.patch("/:id", answer.update_answer);
- router.patch("/:id/upvote", auth, answer.upvote);
- router.patch("/:id/downvote", auth, answer.downvote);

- router.delete("/:id", auth, question.delete_question);

----------------------------
<b>Future Work:</b> 
- User can receive badges for their valued contributions, which represents a gamification of the traditional Q&A website.
- Users unlock new privileges with an increase in reputation like the ability to vote, comment, and even edit other people's posts.
