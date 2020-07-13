import generateFileMd5 from "../../utils/generateFileMd5";
export default {
  methods: {
    fileChanged() {
      let _this = this;
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        let file = this.$refs.file.files[i];
        generateFileMd5(file).then(md5 => console.log(md5));
      }
    }
  },
  render() {
    return (
      <div>
        <input
          type="file"
          class="bigfile"
          onchange={this.fileChanged}
          ref="file"
          name="file"
          multiple
        />
      </div>
    );
  }
};
