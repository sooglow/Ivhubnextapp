//public/components/TextEditor.tsx
import React from "react";
import Editor from "@/public/lib/ckeditor5/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axios from "axios";
import { logOutProc } from "@/public/utils/utils";

function TextEditor({
    data,
    setData,
}: {
    data: string;
    setData: (data: string) => void;
}): React.ReactElement {
    const edrtorConfiguration = {
        toolbar: {
            items: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "imageUpload",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "undo",
                "redo",
                "alignment",
            ],
        },
        language: "ko",
        image: {
            toolbar: [
                "imageTextAlternative",
                "toggleImageCaption",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
            ],
        },
        table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
    };

    function uploadAdapter(loader: any) {
        return {
            upload: () => {
                return loader.file.then((file: any) => {
                    const tokenInfo = JSON.parse(localStorage.getItem("atKey") || "{}");
                    if (!tokenInfo) {
                        logOutProc();
                        return;
                    }
                    const data = new FormData();
                    data.append("file", file);

                    return axios({
                        url: process.env.REACT_APP_API_URL + "/File/upload",
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${tokenInfo.token}`, // 토큰
                            "Content-Type": "multipart/form-data",
                        },
                        data: data,
                    })
                        .then((response) => {
                            if (response.data.fileUrl) {
                                return {
                                    default: response.data.fileUrl,
                                };
                            }
                        })
                        .catch((error) => {
                            console.error("Upload failed:", error);
                            return Promise.reject("Upload failed");
                        });
                });
            },
        };
    }

    function uploadPlugin(editor: any) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return uploadAdapter(loader);
        };
    }

    return (
        <>
            <CKEditor
                config={{
                    ...edrtorConfiguration,
                    extraPlugins: [uploadPlugin],
                }}
                editor={Editor}
                data={data}
                onChange={(event, editor) => {
                    setData(editor.getData()); // 에디터 작성 내용 저장
                }}
            />
            <style jsx global>{`
                .ck-editor__editable {
                    min-height: 400px !important;
                }
            `}</style>
        </>
    );
}

export default TextEditor;
