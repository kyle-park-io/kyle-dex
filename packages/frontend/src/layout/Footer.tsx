import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';

import Notion from '/notion-icon.svg?url';
import Linkedin from '/linkedin-icon.png?url';
import Github from '/github-icon.png?url';

const Footer: Component = (): JSX.Element => {
  const handleNotionClick = (): void => {
    window.open(
      'https://www.notion.so/kyle-park/c92ee6d25f1f48fe8fa54ef5fa79790c',
    );
  };
  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };
  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3}></Col>
          <Col
            md={6}
            class="tw-flex tw-justify-center tw-items-center tw-h-8 tw-text-white"
          >
            <footer>
              <span>© 2024 kyle-park-io</span>
            </footer>
          </Col>
          <Col
            md={3}
            class="tw-flex tw-justify-end tw-items-center tw-h-8 tw-gap-1"
          >
            <img
              src={Notion}
              alt="Notion"
              onClick={handleNotionClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
            <img
              src={Linkedin}
              alt="Linkedin"
              onClick={handleLinkedinClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
            <img
              src={Github}
              alt="Github"
              onClick={handleGithubClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Footer;
