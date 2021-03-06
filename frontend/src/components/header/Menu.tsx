import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Assets
import styles from '../../assets/sass/_variables.scss';

// Components
import Footer from '../../components/Footer';

// Data + Utils
import API from '../../data/FrontendAPI';
import { Topic } from '../../utils/Types';

// MUI
import { Stack, Slide } from '@mui/material';
import {
  Science as ScienceIcon,
  AttachMoney as BusinessIcon,
  Memory as TechnologyIcon,
  Tag as GeneralIcon,
} from '@mui/icons-material';

type Props = {
  show?: boolean;
  topAnchor?: number;
};

export default function Menu({ show = true, topAnchor = 0 }: Props) {
  const location = useLocation();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    API.getAllTopics().then((topics) => setTopics(topics));
  }, []);

  if (topics) {
    const categories = topics.reduce((acc: any, d) => {
      if (Object.keys(acc).includes(d.category)) return acc;

      acc[d.category] = topics.filter((g) => g.category === d.category);
      return acc;
    }, {});

    const renderTopics = () => {
      return (
        <Stack direction={'column'} justifyContent={'flex-start'} spacing={1}>
          {Object.keys(categories).map((category: any) => {
            return (
              <Stack direction={'column'} spacing={'6px'} key={category}>
                {categories[category].map((x: Topic) => {
                  const pathname = (
                    location.pathname
                      .trim()
                      .replace(/([A-Z])/g, ' $1')
                      .split('/')
                      .pop() ?? ''
                  ).trim();
                  const activeTopic: boolean =
                    pathname.localeCompare(x.subtopic ?? x.category) === 0;

                  return (
                    <p
                      key={x.subtopic}
                      onClick={() => {
                        window.location.href = `/topics/${x.category}${
                          x.subtopic ? `/${x.subtopic.replace(/\s/g, '')}` : ''
                        }`;
                      }}
                      className={`${x.subtopic ? 'subtopic' : 'category'}`}
                      style={{
                        fontWeight: activeTopic ? 500 : '',
                        color: activeTopic ? 'white' : '',
                        backgroundColor: activeTopic
                          ? styles.color_primary_500
                          : '',
                      }}
                    >
                      <Stack direction={'row'} alignItems={'center'}>
                        {!x.subtopic ? renderCategoryIcon(x.category) : null}
                        {x.subtopic ?? x.category}
                      </Stack>
                    </p>
                  );
                })}
              </Stack>
            );
          })}
        </Stack>
      );
    };

    const renderCategoryIcon = (category: string) => {
      const style = {
        width: 17,
        height: 17,
        marginTop: -3,
        marginRight: 4,
        marginLeft: -2,
      };

      switch (category) {
        case 'Science':
          return <ScienceIcon style={style} />;
        case 'Technology':
          return <TechnologyIcon style={style} />;
        case 'Business':
          return <BusinessIcon style={style} />;
        default:
          return <GeneralIcon style={style} />;
      }
    };

    return (
      <Slide in={show} direction={'right'}>
        <div
          className={'menu'}
          style={{
            paddingTop: topAnchor,
          }}
        >
          <h2>Topics</h2>
          {renderTopics()}
          <Footer />
        </div>
      </Slide>
    );
  } else {
    return <></>;
  }
}
