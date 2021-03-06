import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Assets
import styles from '../../assets/sass/_variables.scss';

// Components
import AnswerComponent from '../../components/post/AnswerComponent';
import PostAnswer from '../../components/post/PostAnswer';
import QuestionComponent from '../../components/post/QuestionComponent';

// Data + Utils
import API from '../../data/FrontendAPI';
import { QuestionPost } from '../../utils/Types';
import { UserContext } from '../../App';

// MUI
import { Button, Stack } from '@mui/material';

export default function PostComponent() {
  const navigate = useNavigate();
  const currentUser = useContext(UserContext);
  let { qid } = useParams();

  // States
  const [post, setPost] = useState<QuestionPost>();

  useEffect(() => {
    if (qid) {
      API.Questions.getQuestionPost(qid).then((post) => {
        setPost(post);
      });
    }
  }, []);

  const renderQuestion = () => {
    return post ? <QuestionComponent question={post.question} /> : null;
  };

  const renderAnswers = () => {
    return post && post.answers && post.answers.length > 0 ? (
      <>
        <h2>
          {post.answers.length} Answer{post.answers.length === 1 ? '' : 's'}
        </h2>

        <Stack spacing={3}>
          {post.answers.map((answer) => {
            return <AnswerComponent answer={answer} key={answer.uid} />;
          })}
        </Stack>
      </>
    ) : (
      <h2
        style={{
          color: styles.color_muted_400,
          marginTop: 80,
          marginBottom: 0,
        }}
      >
        No answers yet...
      </h2>
    );
  };

  const renderPostAnswer = () => {
    if (currentUser) {
      if (post && post.answers) {
        const userAlreadyAnswered: boolean = post.answers.some(
          (answer) => answer.uid === currentUser
        );
        return userAlreadyAnswered ? null : <PostAnswer qid={qid} />;
      } else {
        return null;
      }
    } else {
      return post ? (
        <Button
          variant={'contained'}
          onClick={() => navigate('/login')}
          style={{ width: 200 }}
        >
          Login to answer
        </Button>
      ) : null;
    }
  };

  return (
    <Stack spacing={4} minWidth={'100%'}>
      {renderQuestion()}
      {renderAnswers()}
      {renderPostAnswer()}
    </Stack>
  );
}
