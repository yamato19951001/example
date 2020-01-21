/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Layer } from "./Layer";
import PropTypes from "prop-types";
import { useTheme } from "./Theme/Providers";

type SectionTypeVariants = "TableHead" | "TableBody";

interface TableSectionContextType {
  type: SectionTypeVariants;
}

const TableSectionContext = React.createContext<TableSectionContextType>({
  type: "TableHead"
});

const TableContext = React.createContext({ fixed: false });

/**
 * A Table provides a useful abstraction for managing rows and columns.
 */

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** An optional minimum width for table content. */
  minWidth?: string;
  /** An optional array of fixed layout widths for each column */
  fixed?: string[];
}

export const Table: React.FunctionComponent<TableProps> = ({
  children,
  minWidth,
  fixed,
  ...other
}) => {
  const theme = useTheme();

  return (
    <div
      css={{
        width: "100%",
        display: "block",
        overflowX: minWidth ? "auto" : "initial"
      }}
    >
      <table
        css={{
          borderSpacing: 0,
          borderCollapse: "separate",
          width: "100%",
          fontFamily: theme.fonts.base,
          WebkitAppearance: "none",
          WebkitFontSmoothing: "antialiased",
          display: "table",
          minWidth,
          tableLayout: fixed ? "fixed" : undefined
        }}
        {...other}
      >
        {fixed && (
          <colgroup>
            {fixed.map((width, i) => {
              return <col key={i} width={width} />;
            })}
          </colgroup>
        )}
        <TableContext.Provider value={{ fixed: fixed ? true : false }}>
          {children}
        </TableContext.Provider>
      </table>
    </div>
  );
};

Table.propTypes = {
  minWidth: PropTypes.string,
  fixed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node
};

/**
 * A TableHead is used to render column labels in a table.
 */

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableHead({ children, ...other }: TableHeadProps) {
  return (
    <thead
      css={{
        display: "table-header-group"
      }}
      {...other}
    >
      <TableSectionContext.Provider value={{ type: "TableHead" }}>
        {children}
      </TableSectionContext.Provider>
    </thead>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** A callback when a row is selected */
  onClick?: () => void;
}

export const TableRow: React.FunctionComponent<TableRowProps> = ({
  onClick,
  children,
  ...other
}) => {
  const theme = useTheme();
  const { type: tableSectionType } = React.useContext(TableSectionContext);

  const buttonProps = onClick
    ? {
        role: "button",
        tabIndex: 0
      }
    : {};

  return (
    <tr
      onClick={onClick}
      css={{
        height: tableSectionType === "TableHead" ? "31px" : "49px",
        display: "table-row",
        outline: "none",
        verticalAlign: "middle",
        cursor: onClick ? "pointer" : "default",
        ":hover": {
          background: onClick ? theme.colors.background.tint1 : "none"
        }
      }}
      {...buttonProps}
      {...other}
    >
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node
};

/**
 * TableCell, used for both <td> and <th> elements.
 */

const tableCellAlignments = {
  right: css({
    textAlign: "right",
    flexDirection: "row-reverse"
  }),
  left: css({
    textAlign: "left"
  }),
  center: css({
    textAlign: "center"
  }),
  justify: css({
    textAlign: "justify"
  })
};

type tableCellVariants = "head" | "body";

type TableCellBaseProps = React.ThHTMLAttributes<HTMLTableHeaderCellElement> &
  React.TdHTMLAttributes<HTMLTableDataCellElement>;

interface TableCellProps extends TableCellBaseProps {
  align?: keyof typeof tableCellAlignments;
  variant?: tableCellVariants;
  ellipsis?: boolean;
  component?: React.ReactType<TableCellBaseProps>;
}

export const TableCell: React.FunctionComponent<TableCellProps> = ({
  align = "left",
  variant,
  component,
  ellipsis,
  children,
  ...other
}) => {
  const theme = useTheme();
  const { type: tableSectionType } = React.useContext(TableSectionContext);

  const Component =
    component || (tableSectionType === "TableHead" ? "th" : "td");

  const type = variant || (tableSectionType === "TableHead" ? "head" : "body");

  return (
    <Component
      css={[
        {
          zIndex: 4,
          position: "relative",
          borderBottom: "1px solid",
          borderColor:
            tableSectionType === "TableBody"
              ? theme.colors.border.muted
              : theme.colors.border.default,
          display: "table-cell",
          padding: `${theme.spaces.xs} ${theme.spaces.sm}`,
          [theme.mediaQueries.md]: {
            paddingLeft: theme.spaces.md,
            paddingRight: theme.spaces.md
          },
          ":last-child": {
            paddingRight: theme.spaces.md
          }
        },
        ellipsis && {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        },
        type === "head"
          ? {
              fontWeight: 500,
              fontSize: theme.fontSizes[0],
              color: theme.colors.text.muted
            }
          : {
              fontWeight: 400,
              fontSize: theme.fontSizes[0],
              color: theme.colors.text.default
            },
        tableCellAlignments[align]
      ]}
      scope="col"
      {...other}
    >
      {children}
    </Component>
  );
};

TableCell.propTypes = {
  align: PropTypes.oneOf(Object.keys(tableCellAlignments)),
  variant: PropTypes.oneOf(["body", "head"]),
  component: PropTypes.elementType,
  ellipsis: PropTypes.bool,
  children: PropTypes.node
};

/**
 * TableBody - indicates the body (and scrollable) portion of our table.
 */

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export function TableBody({ children, ...other }: TableBodyProps) {
  return (
    <tbody
      css={{
        display: "table-row-group"
      }}
      {...other}
    >
      <TableSectionContext.Provider value={{ type: "TableBody" }}>
        {children}
      </TableSectionContext.Provider>
    </tbody>
  );
}

/**
 * An ExpandingRow displays additional content about the row when clicked.
 */

interface ExpandingRowProps {
  /** The expanded content to show when the user selects the row */
  content: (close: () => void) => React.ReactNode | React.ReactNode;
  children: React.ReactNode;
}

export const ExpandingRow: React.FunctionComponent<ExpandingRowProps> = ({
  content,
  children
}) => {
  const theme = useTheme();
  const [selected, setSelected] = React.useState(false);

  function close() {
    setSelected(false);
  }

  function open() {
    setSelected(true);
  }

  return (
    <TableBody>
      <TableRow onClick={open}>{children}</TableRow>
      {selected && (
        <tr css={{ display: "table-row", height: "100px" }}>
          <td
            colSpan={React.Children.count(children)}
            css={{
              borderBottom: 0,
              width: "inherit",
              padding: 0,
              position: "relative"
            }}
          >
            <div
              css={{
                zIndex: 3,
                width: "inherit",
                position: "relative",
                paddingBottom: "24px"
              }}
            >
              <div
                css={{
                  position: "relative",
                  whiteSpace: "normal",
                  height: "auto",
                  display: "block",
                  paddingTop: "24px"
                }}
              >
                {typeof content === "function" ? content(close) : content}
              </div>
            </div>
            <Layer
              css={{
                position: "absolute",
                top: "-49px",
                left: "-16px",
                right: "-16px",
                borderRadius: theme.radii.md,
                bottom: 0,
                zIndex: 2
              }}
            >
              {null}
            </Layer>
          </td>
        </tr>
      )}
    </TableBody>
  );
};

ExpandingRow.propTypes = {
  content: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  children: PropTypes.node
};
