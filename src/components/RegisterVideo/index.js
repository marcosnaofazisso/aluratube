import React from "react";
import { StyledRegisterVideo } from "./styles";
import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://zwsndgmbsdgjescqjpjh.supabase.co"
const PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3c25kZ21ic2RnamVzY3FqcGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxODI1MzAsImV4cCI6MTk4Mzc1ODUzMH0.BXUkUctSuQn_Sujps3cEXJK4TRiO6ZilNQwl1DXWsJ8"
const supabase = createClient(PROJECT_URL, PUBLIC_KEY);


function useForm(props) {
    const [values, setValues] = React.useState(props.initialValues);
    const [loading, setLoading] = React.useState(false);

    return {
        values,
        loading,
        setLoading,
        handleChange: (evento) => {
            const value = evento.target.value;
            const name = evento.target.name
            if (name == "url") setLoading(true)
            setValues({
                ...values,
                [name]: value,
            });
        },
        handleThumbNail: (id) => {
            const thumbImage = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
            setValues({ ...values, thumbImage: thumbImage })
        },
        clearForm() {
            setValues(props.initialValues);
        }
    };
}

export default function RegisterVideo() {

    const formCadastro = useForm({
        initialValues: { titulo: "", url: "", thumbImage: "" }
    });
    const [formVisivel, setFormVisivel] = React.useState(false);

    function getThumbnail(url) {
        if (url.length >= 43) {
            let videoId = ''
            for (let i = 32; i < 43; i++) {
                videoId += url[i]
            }
            formCadastro.handleThumbNail(videoId)

        }
    }

    React.useEffect(() => {
        const delay = setTimeout(() => {
            if (formCadastro.values.url && formCadastro.values.url !== "") {
                formCadastro.setLoading(false)
                getThumbnail(formCadastro.values.url)
            }
        }, 2500)

        return () => clearTimeout(delay)
    }, [formCadastro.values.url])


    return (
        <StyledRegisterVideo>
            <button className="add-video" onClick={() => setFormVisivel(true)}>
                +
            </button>

            {formVisivel
                ? (
                    <form onSubmit={(evento) => {
                        evento.preventDefault();

                        const payload = {
                            titulo: formCadastro.values.titulo,
                            url: formCadastro.values.url,
                            thumb: formCadastro.values.thumbImage,
                        }
                        console.log("PAYLOAD ===>>>", payload);

                        // Contrato entre o nosso Front e o BackEnd
                        supabase.from("videos").insert(payload)
                            .then((response) => {
                                console.log("response", response);
                            })
                            .catch((err) => {
                                console.log("Erro: ", err);
                            })

                        setFormVisivel(false);
                        formCadastro.clearForm();
                    }}>
                        <div>
                            <button type="button" className="close-modal" onClick={() => setFormVisivel(false)}>
                                X
                            </button>
                            <input
                                placeholder="Titulo do vídeo"
                                name="titulo"
                                value={formCadastro.values.titulo}
                                onChange={formCadastro.handleChange}
                            />
                            <input
                                placeholder="URL"
                                name="url"
                                value={formCadastro.values.url}
                                onChange={formCadastro.handleChange}
                            />
                            {formCadastro.loading && <p>Carregando...</p>}
                            {formCadastro.values.thumbImage === "" && !formCadastro.loading && <p>Digite uma URL válida</p>}
                            {formCadastro.values.thumbImage !== "" && formCadastro.values.thumbImage ? <img src={formCadastro.values.thumbImage} alt="image" /> : null}
                            <button type="submit">
                                Cadastrar
                            </button>
                        </div>
                    </form>
                )
                : false}
        </StyledRegisterVideo>
    )
}