import type { EvidenciaFormItemResponse, EvidenciaItemRequest, EvidenciaType } from "./requisitos/requisito";
import { RequisitoFactory } from "./requisitos/requisito";

export class ItemNormaService {
    dbReponse: { type: EvidenciaType, pergunta: string, qnt?: number, grupo?: string[], arquivo?: string }[] = [{
        type: "arquivo",
        pergunta: "Diagrama Unifilar",
        qnt: 1
    },
    {
        type: "grupo",
        pergunta: "Grupo",
        grupo: ["Grupo 1", "Grupo 2"],
        arquivo: "Diagrama Unifilar"
    },
    {
        type: "parecer",
        pergunta: "Tem tal procedimento?"
    },
    {
        type: "checklist",
        pergunta: "Tem todos os itens?"
    }
    ]
    getItemNorma(itemNormaId?: string) {
        return {
            nome: "Item 10.1.1",
            descricao: "Descrição do item 10.1.1",
            requisitos: this.dbReponse.map(item => {
                return RequisitoFactory.create[item.type](item.pergunta, item.qnt, item.grupo, item.arquivo)
            })
        }
    }
    // Diagnostico
    getForm(itemNormaId?: string): EvidenciaFormItemResponse[] {

        return this.dbReponse.map(item => {
            return RequisitoFactory.create[item.type](item.pergunta, item.qnt, item.grupo, item.arquivo).getFormItem()
        })
    }
    postForm(evidencias: EvidenciaItemRequest[]) {
        evidencias.forEach(evidencia => {
            const result = RequisitoFactory.validade[evidencia.type](evidencia)
            if (result instanceof Error) {
                throw result
            }
        })
    }
}
