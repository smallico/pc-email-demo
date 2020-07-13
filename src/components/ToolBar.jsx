import style from "./ToolBar.module.scss";

export default {
  render() {
    return <div class={style.toolbar}>{this.$slots["default"]}</div>;
  }
};
