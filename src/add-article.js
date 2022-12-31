import { createClient } from '@supabase/supabase-js';

export async function insertArticle(title, description, code) {
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { data, error } = await db.from('articles').insert([{ title, description, code }]).select();

    return { data, error};
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("add-article-form");
    if(form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = form.elements.title.value;
            const description = form.elements.description.value;
            const code = form.elements.code.value;
            let redirectPage = "article-add-error.html";
            
            if (title && description) {
                try {
                    const result = await insertArticle(title, description, code);
                    if (!result.error && result.data !== null) {
                        redirectPage = "article-added-success.html";
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            window.location.href = redirectPage;
        });
    }
});
