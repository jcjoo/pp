export type EvidenciaFormItemResponse = {
    pergunta: String,
    respostas: { label: String, valueType: String }[],
    arquivoPadrao?: String
}

export type EvidenciaType = "arquivo" | "grupo" | "parecer" | "checklist"
export type EvidenciaItemRequest = {
    type: EvidenciaType
    pergunta: String,
    respostas: { path?: string, observacao?: string, status: EvidenciaStatus }[],
    arquivoPadrao?: String
}
export type EvidenciaStatus = "Conforme" | "Não Conforme" | "Parcialmente Conforme"

export abstract class Requisito {
    pergunta: string
    constructor(pergunta: string) {
        this.pergunta = pergunta;
    }
    abstract getFormItem(): EvidenciaFormItemResponse
    static validateEvidencia(evidencia: EvidenciaItemRequest): true | Error {
        return true
    }
}

class ArquivoRequisito extends Requisito {
    qnt: number;
    constructor(pergunta: string, qnt: number) {
        super(pergunta);
        this.qnt = qnt;
    }
    getFormItem(): EvidenciaFormItemResponse {
        return {
            pergunta: this.pergunta,
            respostas: Array.from({ length: this.qnt }, (_, i) => ({ label: `Arquivo ${i + 1}`, valueType: "file" }))
        }
    }
    validateEvidencia(evidencia: EvidenciaItemRequest): true | Error {
        if (evidencia.respostas.some(resposta => resposta.path === "")) {
            return new Error("Arquivo não encontrado");
        }

        return true
    }
}
class GrupoRequisito extends Requisito {
    grupo: String[]
    arquivo: string
    constructor(pergunta: string, grupo: String[], arquivo: string) {
        super(pergunta);
        this.grupo = grupo;
        this.arquivo = arquivo;
    }
    getFormItem(): EvidenciaFormItemResponse {
        return {
            pergunta: this.pergunta,
            respostas: this.grupo.map((tag, i) => ({ label: tag, valueType: "file" })),
            arquivoPadrao: this.arquivo
        }
    }
    validateEvidencia(evidencia: EvidenciaItemRequest): true | Error {
        if (evidencia.respostas.some(resposta => resposta.path === "")) {
            return new Error("Arquivo não encontrado");
        }

        return true
    }
}

class ParecerRequisito extends Requisito {
    constructor(pergunta: string) {
        super(pergunta);
    }
    getFormItem(): EvidenciaFormItemResponse {
        return {
            pergunta: this.pergunta,
            respostas: [{ label: "Parecer", valueType: "text" }]
        }
    }
    validateEvidencia(evidencia: EvidenciaItemRequest): true | Error {
        return true
    }
}

class CheckListRequisito extends Requisito {
    constructor(pergunta: string) {
        super(pergunta);
    }
    getFormItem(): EvidenciaFormItemResponse {
        return {
            pergunta: this.pergunta,
            respostas: [{ label: "Sim ou Não", valueType: "checklist" }]
        }
    }
    validateEvidencia(evidencia: EvidenciaItemRequest): true | Error {
        return true
    }
}

export class RequisitoFactory {
    static createArquivoRequisito(pergunta: string, qnt: number): Requisito {
        return new ArquivoRequisito(pergunta, qnt);
    }

    static createGrupoRequisito(pergunta: string, grupo: String[], arquivo: string): Requisito {
        return new GrupoRequisito(pergunta, grupo, arquivo);
    }
    static createParecerRequisito(pergunta: string): Requisito {
        return new ParecerRequisito(pergunta);
    }
    static createCheckListRequisito(pergunta: string): Requisito {
        return new CheckListRequisito(pergunta);
    }

    static create: { [key in EvidenciaType]: (pergunta: string, ...args: any[]) => Requisito } = {
        "arquivo": (pergunta: string, qnt: number) => new ArquivoRequisito(pergunta, qnt),
        "grupo": (pergunta: string, grupo: String[], arquivo: string) => new GrupoRequisito(pergunta, grupo, arquivo),
        "parecer": (pergunta: string) => new ParecerRequisito(pergunta),
        "checklist": (pergunta: string) => new CheckListRequisito(pergunta)
    }

    static validade: { [key in EvidenciaType]: (evidencia: EvidenciaItemRequest) => true | Error } = {
        "arquivo": ArquivoRequisito.validateEvidencia,
        "grupo": GrupoRequisito.validateEvidencia,
        "parecer": ParecerRequisito.validateEvidencia,
        "checklist": CheckListRequisito.validateEvidencia
    }
}