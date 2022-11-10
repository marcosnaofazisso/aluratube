import React from "react";
import { StyledRegisterVideo } from "./styles";

function useForm(props) {
    const [values, setValues] = React.useState(props.initialValues);
    const [loading, setLoading] = React.useState(false);

    return {
        values,
        loading,
        setLoading,
        handleChange: (evento) => {
            console.log(`${evento.target.name}: `, evento.target.value);
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
        initialValues: { titulo: "Arquitetura de Sistemas", url: "", thumbImage: "" }
    });
    const [formVisivel, setFormVisivel] = React.useState(false);

    function getThumbnail(url) {
        if (url.length > 43) {
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
                        console.log(formCadastro.values);
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