<?php

namespace App\Livewire;

use Livewire\Attributes\On;

use Livewire\Component;

class NomeDoComponente extends Component
{

    public int $count = 0;

    public function render()
    {
        return view('livewire.nome-do-componente');
    }

    #[On('echo:JETETE,TestingReverb')]
    public function add()
    {
        $this->count++;
    }
}
