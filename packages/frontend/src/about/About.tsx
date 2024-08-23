import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col, Image } from 'solid-bootstrap';
// image
import Duck from '/duck-bg.svg?url';

const About: Component = (): JSX.Element => {
  return (
    <>
      <Container fluid class="tw-p-4">
        <Row>
          <Col md={12}>
            <h1>About</h1>
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md={7} xs={12}>
            <ol>
              <li>
                <p>
                  이 프로젝트는 실제 DEX 거래소 내에서의 거래를 가상으로
                  실현하고, 이를 통해 DEX 프로젝트 내의 개념들을 학습하는 것을
                  목표로 합니다.
                </p>
              </li>
              <li>
                <p>
                  DEX 컨트랙트는 팬케이크 스왑(유니 스왑) V2 를 기반으로
                  작성되었습니다.
                </p>
                <p>
                  <a href="https://github.com/pancakeswap/pancake-smart-contracts/tree/master/projects/exchange-protocol">
                    Pancake Swap V2
                  </a>
                </p>
              </li>
              <li>
                <p>컨트랙트의 자세한 내용은 해당 노션을 참고해 주세요.</p>
                <p>
                  <a href="">Notion</a>
                </p>
              </li>
              <li>
                <p>본 프로젝트에 적용된 기술 및 개발 언어는 다음과 같습니다.</p>
                <ul>
                  <li>GKE (GCP)</li>
                  <li>Kubenetes</li>
                  <li>Docker</li>
                  <li>
                    Solidity
                    <ul>
                      <li>DEX Contracts</li>
                    </ul>
                  </li>
                  <li>
                    Typescript
                    <ul>
                      <li>
                        Backend
                        <ul>
                          <li>NestJS</li>
                        </ul>
                      </li>
                      <li>
                        Frontend
                        <ul>
                          <li>SolidJS</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <p>
                  각 항목에 대한 자세한 기술 설명은 해당 노션을 참고해 주세요.
                </p>
                <p>
                  <a href="">Notion</a>
                </p>
              </li>
              <li>
                <p>버전 업데이트 관련 문서</p>
                <p>
                  <a href="">Notion</a>
                </p>
              </li>
            </ol>
          </Col>
          <Col md={5} xs={12}>
            <Image src={Duck} fluid class="d-none d-md-block"></Image>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
