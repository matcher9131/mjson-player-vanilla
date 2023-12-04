const decoder = new TextDecoder("utf-8");

for await (const { name, isFile } of Deno.readDir("/public/data")) {
    if (!isFile) continue;
}
