// Chrome Extension Types
declare namespace chrome {
    namespace storage {
        namespace sync {
            function get(keys: string | string[] | null): Promise<{ [key: string]: any }>;
            function set(items: { [key: string]: any }): Promise<void>;
            function remove(keys: string | string[]): Promise<void>;
        }
    }
}

declare global {
    interface ImportMetaEnv {
        readonly VITE_GEMINI_API_KEY?: string;
        readonly VITE_OPENAI_API_KEY?: string;
        readonly VITE_CLAUDE_API_KEY?: string;
        readonly DEV: boolean;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export { };
