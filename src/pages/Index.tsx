// Update this page (the content is just a fallback if you fail to update the page)
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-indigo-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-indigo-700">
              Acompañamiento para Ansiedad
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Tu espacio seguro entre sesiones terapéuticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Esta aplicación está diseñada para acompañarte en momentos de ansiedad, 
                validando tus emociones y proponiendo ejercicios terapéuticos breves 
                basados en TCC, mindfulness y grounding.
              </p>
              <p className="text-gray-600 italic">
                "Un acompañamiento empático, siempre disponible cuando más lo necesitas"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-indigo-600">Validación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Tus emociones son válidas y merecen ser escuchadas
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-indigo-600">Ejercicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Técnicas prácticas para manejar la ansiedad en el momento
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-indigo-600">Apoyo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Un acompañamiento empático entre sesiones terapéuticas
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg mb-4"
            >
              Comenzar mi acompañamiento
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Esta aplicación es un acompañamiento entre sesiones terapéuticas, 
              no reemplaza la terapia profesional.
            </p>
          </CardFooter>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;