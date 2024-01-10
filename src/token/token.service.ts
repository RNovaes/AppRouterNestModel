import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenRepository: Repository<Token>,
    private usuarioService: UsuarioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) { }

  async save(hash: string, nomeusuario: string) {
    //Esta variável let objtoken busca no repositório através do findoneby o usuario
    let objToken = await this.tokenRepository.findOneBy({ nomeusuario: nomeusuario })
    if (objToken) {
      //O primeiro parâmetro (objToken.id é para buscar o id do usuário logado, o segundo parâmetro (hash) é o que eu desejo alterar(UPDATE))
      this.tokenRepository.update(objToken.id, {
        hash: hash
      })
    } else {
      this.tokenRepository.insert({
        hash: hash,
        nomeusuario: nomeusuario
      })
    }
  }

  async refreshToken(oldToken: string){
    let objToken = await this.tokenRepository.findOneBy({hash: oldToken})
    if(objToken){
      let usuario = await this.usuarioService.findOne(objToken.nomeusuario)
      return this.authService.login(usuario)
    }else{
      return new HttpException({
        errorMessage: 'Token Inválido'
      },HttpStatus.UNAUTHORIZED)
    }
  }

  async getUsuarioByToken(token: string): Promise<Usuario>{
    token = token.replace("Bearer ","").trim()
    console.log(token)
    let objToken: Token = await this.tokenRepository.findOneBy({hash: token})
    if(objToken){
      let usuario = await this.usuarioService.findOne(objToken.nomeusuario)
      return usuario
    }else{
      return null
    }
  }

}