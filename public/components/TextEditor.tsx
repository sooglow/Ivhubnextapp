//public/components/TextEditor.tsx
import React from "react";
import Editor from "@/public/lib/ckeditor5/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import axiosInstance from "@/public/lib/axiosInstance";

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
                    const data = new FormData();
                    data.append("file", file);

                    return axiosInstance
                        .post(process.env.NEXT_PUBLIC_API_URL + "/File/upload", data, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
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
