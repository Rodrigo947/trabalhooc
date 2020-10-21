#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

vector<int> pc;

void lerArquivo(){
    
    string nomeArquivo,stringBinario;
    int intBinario;
    ifstream arquivo_entrada;
    
    cout<< "Nome do arquivo: ";
    cin >> nomeArquivo;

    arquivo_entrada.open(nomeArquivo);
    
    while (arquivo_entrada >> stringBinario) // Leitura e conversão para decimal
        pc.push_back(stoi(stringBinario,nullptr,2)); 
      
}


int main(int argc, char const *argv[])
{
    
    int op = 0;
    while (op != 5)
    {
        cout << "----MENU----"<< endl;
        cout << "1.Carga do Arquivo"<< endl;
        cout << "2.Entrada via teclado"<< endl;
        cout << "3.Iniciar execucao"<< endl;
        cout << "4.Reset"<< endl;
        cout << "5.Sair"<< endl;
        cout << "Opcao: ";
        cin >> op;
        switch (op)
        {
        case 1:
            lerArquivo();
            break;
        
        case 2:
            break;

        case 3:
            break;

        case 4:
            break;
        }
       
    }

    return 0;
    
}
