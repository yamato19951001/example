/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Text } from "./Text";
import PropTypes from "prop-types";
import { useTheme } from "./Theme/Providers";
import { IconChevronRight } from "./Icons";

const hideScrollbar = css`
  ::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "md" | "lg";
  /** A list of BreadcrumbItem children */
  children:
    | React.ReactElement<BreadcrumbItemProps>
    | React.ReactElement<BreadcrumbItemProps>[];
  overflowX?: number;
}

/**
 * Breadcrumbs are useful to orient the user on your site,
 * especially when working with hierarchies of content.
 */
export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  children,
  size = "md",
  overflowX,
  ...other
}) => {
  const theme = useTheme();

  return (
    <nav
      className="Breadcrumbs"
      aria-label="breadcrumb"
      css={[
        {
          maxWidth: "100%",
          overflow: overflowX ? "scroll" : "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          borderRadius: theme.radii.sm,
          msOverflowStyle: "none"
        },
        hideScrollbar
      ]}
      {...other}
    >
      <ol
        className="Breadcrumbs__list"
        css={{
          listStyle: "none",
          whiteSpace: "nowrap",
          display: "inline-flex",
          boxSizing: "border-box",
          overflow: "hidden",
          maxWidth: overflowX ? undefined : "100%",
          margin: 0,
          padding: `${theme.spaces.sm} ${theme.spaces.md}`,
          borderRadius: theme.radii.md
        }}
      >
        {React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) {
            return child;
          }

          return React.cloneElement(child as any, {
            size,
            "aria-current":
              i === validChildrenCount(children) - 1 ? "page" : undefined
          });
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["md", "lg"]),
  overflowX: PropTypes.bool
};

function validChildrenCount(children: any) {
  return React.Children.toArray(children).filter(child =>
    React.isValidElement(child)
  ).length;
}

interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  inverted?: boolean;
  size?: "md" | "lg";
}

/**
 *  Each item in a list of breadcrumbs.
 */

export const BreadcrumbItem: React.FunctionComponent<BreadcrumbItemProps> = ({
  children,
  size = "md",
  ...other
}) => {
  const current = other["aria-current"];

  return (
    <li
      className="BreadcrumbItem"
      css={{
        flex: "0 1 auto",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}
      {...other}
    >
      <Text
        className="BreadcrumbItem__text"
        wrap={false}
        component="div"
        variant={size === "md" ? "body" : "h5"}
        gutter={false}
        css={{
          "& > a": {
            textDecoration: "none"
          }
        }}
      >
        {children}
      </Text>
      {!current && <BreadcrumbDivider />}
    </li>
  );
};

BreadcrumbItem.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["md", "lg"])
};

const BreadcrumbDivider: React.FunctionComponent = () => {
  const theme = useTheme();

  return (
    <IconChevronRight
      className="BreadcrumbDivider"
      color={theme.colors.text.muted}
      css={{
        flex: "0 0 auto",
        margin: `0 ${theme.spaces.sm}`
      }}
    />
  );
};

BreadcrumbDivider.propTypes = {
  inverted: PropTypes.bool
};
