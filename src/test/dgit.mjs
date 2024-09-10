import dgit from "@dking/dgit";

async function download () {
  await dgit.default(
    {
      owner: 'xlei1123',
      repoName: 'limu-ele-pro',
      ref: 'main',
      relativePath: `src/views/list1`,
    },
    './list1',
    {
      log: true, // 是否开启内部日志
    }
  );
}

download();
