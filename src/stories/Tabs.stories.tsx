/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Tabs, Tab, TabPanel } from "../Tabs";
import theme from "../Theme";
import { Text } from "../Text";
import { Container } from "../Container";
import { Badge } from "../Badge";
import { storiesOf } from "@storybook/react";
import { Layer } from "../Layer";
import { TabContent } from "../TabContent";

const Example = () => {
  const [value, setValue] = React.useState(0);

  return (
    <div
      css={{
        paddingTop: theme.spaces.xl,
        // borderBottom: "1px solid ",
        // borderColor: theme.colors.border.default,
        background: theme.colors.background.blueTint
      }}
    >
      <Tabs value={value} onChange={i => setValue(i)}>
        <Tab id="course" onClick={() => alert("clicked!")}>
          Course events
        </Tab>
        <Tab id="settings" badge={<Badge>23</Badge>}>
          Settings
        </Tab>
        <Tab id="templates">Templates</Tab>
        <Tab id="courses">Courses</Tab>
        <Tab id="members">Team members</Tab>
      </Tabs>
    </div>
  );
};

export const TabsExamples = storiesOf("Tabs", module)
  .add("Light background", () => <Example />)
  .add("Dark background", () => {
    const [value, setValue] = React.useState(0);
    return (
      <div
        css={{ background: theme.colors.background.tint1, minHeight: "100vh" }}
      >
        <div
          css={{
            background: theme.colors.palette.blue.base
          }}
        >
          <Container>
            <Text
              variant="h2"
              css={{
                color: "white",
                paddingTop: theme.spaces.lg,
                paddingBottom: theme.spaces.md
              }}
            >
              Visual Thinking Strategies
            </Text>
          </Container>
          <Tabs dark value={value} onChange={i => setValue(i)}>
            <Tab id="hello">Events</Tab>
            <Tab id="cool">Settings</Tab>
            <Tab id="yup">Templates</Tab>
            <Tab id="yup">Courses</Tab>
            <Tab id="yup">Team</Tab>
          </Tabs>
        </div>
        <Container>
          <div css={{ paddingTop: "2rem" }}>
            {value === 0 && <TabPanel id="hello">What's up?</TabPanel>}
            {value === 1 && <TabPanel id="cool">yah it is?</TabPanel>}
          </div>
        </Container>
      </div>
    );
  })
  .add("Evenly spaced", () => {
    const [value, setValue] = React.useState(0);

    return (
      <div
        css={{
          display: "flex",
          justifyContent: "center",
          background: theme.colors.background.tint2,
          padding: "0.5rem"
        }}
      >
        <Layer
          elevation="sm"
          css={{
            maxWidth: "600px",
            maxHeight: "500px",
            width: "100%",
            display: "block",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          <div
            css={{
              background: theme.colors.background.tint1,
              boxSizing: "border-box",
              width: "100%",
              overflow: "hidden",
              height: "200px"
            }}
          >
            <div
              css={{
                background: theme.colors.palette.blue.base
              }}
            >
              <Container>
                <Text
                  variant="h5"
                  css={{
                    color: "white",
                    textAlign: "center",
                    padding: theme.spaces.md
                  }}
                >
                  NHL Hockey
                </Text>
              </Container>
              <Tabs
                variant="evenly-spaced"
                dark
                value={value}
                onChange={i => setValue(i)}
              >
                <Tab id="hello">Games</Tab>
                <Tab id="cool">News</Tab>
                <Tab id="tables">Tables</Tab>
                <Tab id="players">Players</Tab>
              </Tabs>
            </div>
            <TabContent value={value} onChange={i => setValue(i)}>
              <TabPanel id="hello" css={{ padding: "24px" }}>
                What's up?
              </TabPanel>
              <TabPanel id="cool" css={{ padding: "24px" }}>
                Some breaking news
              </TabPanel>
              <TabPanel id="tables" css={{ padding: "24px" }}>
                Some breaking news
              </TabPanel>
              <TabPanel id="players" css={{ padding: "24px" }}>
                Some player info
              </TabPanel>
            </TabContent>
          </div>
        </Layer>
      </div>
    );
  });
