export default {
  props: {
    placement: {
      default: "top"
    },
    content: String
  },
  render() {
    return (
      <span>
        <span>{this.$slots["default"]}</span>
        <ElTooltip content={this.content} placement={this.placement}>
          <i class="el-icon-question" style="cursor: pointer;" />
        </ElTooltip>
      </span>
    );
  }
};
