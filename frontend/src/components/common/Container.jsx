import { cx } from "../../utils/format";

export default function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag className={cx("container-luxe", className)} {...props}>
      {children}
    </Tag>
  );
}
