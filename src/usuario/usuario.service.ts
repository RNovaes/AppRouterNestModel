import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioAlterarDto } from './dto/usuario.alterar.dto';
import { UsuarioAtualizarDto } from './dto/usuario.atualizar.dto';
import { UsuarioAlterarAcessoDto } from './dto/usuario.alterar.acesso.dto';
import { UsuarioAlterarSenhaDto } from './dto/usuario.alterar.senha.dto';
import { UsuarioVerificarEmailDto } from './dto/usuario.verificar.email.dto copy';
import { UsuarioSolicitarSenhaDto } from './dto/usuario.solicitar.senha.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
  ) { }

  async listar(id: number) {
    let user = await this.usuarioRepository.findOneBy({ id: id })
    const { senha, rua, numero, bairro, alterado, acesso, ...result } = user;
    return result
  }

  async listaracesso(id: number) {
    let novo = await this.usuarioRepository.findOneBy({ id: id })
    let acesso = novo.acesso
    return acesso
  }

  async listarperfil(id: number) {
    let perfil = await this.usuarioRepository.findOneBy({ id: id })
    const { senha, acesso, ...result } = perfil;
    return result
  }

  async listarTodos() {
    let clientes = await this.usuarioRepository.find({
      select: {
        id: true,
        nome: true,
        acesso: true,
      },
    });
    return clientes
  }

  async cadastrar(data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    let usuariobanco = await this.usuarioRepository.findOneBy({ email: data.email })
    let usuario = new Usuario()
    usuario.nome = data.nome
    usuario.email = data.email
    usuario.telefone = data.telefone
    usuario.alterado = data.alterado
    usuario.senha = bcrypt.hashSync(data.senha, 8)
    if (!usuariobanco) {
      return this.usuarioRepository.save(usuario)
        .then((result) => {
          return <ResultadoDto>{
            status: true,
            mensagem: "Usuário cadastrado com sucesso"
          }
        }).catch((error) => {
          return <ResultadoDto>{
            status: false,
            mensagem: "Houve um erro ao cadastrar o usuário"
          }
        })
    } else {
      return <ResultadoDto>{
        status: false,
        mensagem: "Email já cadastrado"
      }
    }

  }

  async cadastrarinfo(id: number, data: UsuarioAlterarDto): Promise<ResultadoDto> {
    let usuario = new Usuario()
    usuario.telefone = data.telefone
    usuario.rua = data.rua
    usuario.numero = data.numero
    usuario.bairro = data.bairro
    usuario.alterado = data.alterado
    return this.usuarioRepository.update(id, data)
      .then((result) => {
        return <ResultadoDto>{
          status: true,
          mensagem: "Dados atualizados com sucesso"
        }
      })
      .catch((error) => {
        return <ResultadoDto>{
          status: false,
          mensagem: "Houve um erro ao cadastrar o usuário"
        }
      })
  }

  async atualizardados(id: number, data: UsuarioAtualizarDto): Promise<ResultadoDto> {
    let usuario = new Usuario()
    usuario.nome = data.nome
    usuario.telefone = data.telefone
    usuario.rua = data.rua
    usuario.numero = data.numero
    usuario.bairro = data.bairro
    usuario.alterado = data.alterado
    return this.usuarioRepository.update(id, data)
      .then((result) => {
        return <ResultadoDto>{
          status: true,
          mensagem: "Dados atualizados com sucesso"
        }
      })
      .catch((error) => {
        return <ResultadoDto>{
          status: false,
          mensagem: "Houve um erro ao atualizar o usuário"
        }
      })
  }

  async findOne(email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOneBy({ email: email });
  }

  async alterarAcesso(data: UsuarioAlterarAcessoDto) {
    return this.usuarioRepository.update(data.id, data).then((result) => {
      return <ResultadoDto>{
        status: true,
        mensagem: "Acesso concedido com sucesso"
      }
    })
      .catch((error) => {
        return <ResultadoDto>{
          status: false,
          mensagem: "Houve um erro ao conceder o acesso"
        }
      })
  }

  async novasenha(data: UsuarioAlterarSenhaDto) {
    let novasenha = bcrypt.hashSync(data.senha, 8)
    let dado = new Usuario()
    dado.senha = novasenha
    let usuario = await this.usuarioRepository.findOneBy({ email: data.email })
    if (usuario) {
      return this.usuarioRepository.update(usuario, dado)
    } else {
      console.log("Não achou")
    }
  }

  async verificar(data: UsuarioAlterarSenhaDto) {
    //console.log(data)
    let usuario = await this.usuarioRepository.findOneBy({ email: data.email })
    if (usuario) {
      return <ResultadoDto>{
        status: true,
        mensagem: "Email verificado"
      }
    } else {
      return <ResultadoDto>{
        status: false,
        mensagem: "Email não cadastrado"
      }
    }
  }

  async verificarEmail(data: UsuarioVerificarEmailDto) {
    let usuario = await this.usuarioRepository.findOneBy({email: data.username})
    if (usuario) {
      if (usuario.email == data.username) {
        return <ResultadoDto>{
          status: true,
          mensagem: "Email verificado"
        }
      } else {
        console.log("Email não existe")
      }
    } else {
      return <ResultadoDto>{
        status: false,
        mensagem: "Email não cadastrado"
      }
    }
  }

  async solicitarnovasenha(id: number, data: UsuarioSolicitarSenhaDto) {
    let senha = bcrypt.hashSync(data.novasenha, 8)
    let dado = new Usuario()
    dado.senha = senha
    let usuario = await this.usuarioRepository.findOneBy({ id: id })
    if (usuario) {
      return this.usuarioRepository.update(usuario, dado)
    } else {
      console.log("Não achou")
    }
  }
}